#!/usr/bin/env python3
"""Render the portfolio resume JSON into an ATS-friendly PDF."""

import argparse
import json
import shutil
from html import escape
from pathlib import Path
from urllib.parse import urlparse

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA = ROOT / "data" / "resume.json"
DEFAULT_OUTPUT = ROOT / "output" / "pdf" / "natnael-alemseged-resume.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "resume.pdf"

INK = colors.HexColor("#17211F")
MUTED = colors.HexColor("#52605D")
ACCENT = colors.HexColor("#176B62")
PALE = colors.HexColor("#EAF4F1")
RULE = colors.HexColor("#C9D6D2")


def create_styles():
    styles = getSampleStyleSheet()
    definitions = [
        ParagraphStyle(
            name="ResumeName",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=23,
            leading=25,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=2,
        ),
        ParagraphStyle(
            name="ResumeTitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=11.5,
            leading=14,
            textColor=ACCENT,
            alignment=TA_CENTER,
            spaceAfter=5,
        ),
        ParagraphStyle(
            name="Contact",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=11.2,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        ParagraphStyle(
            name="Section",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.8,
            leading=12,
            textColor=ACCENT,
            spaceBefore=8,
            spaceAfter=4,
            keepWithNext=True,
        ),
        ParagraphStyle(
            name="Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.7,
            leading=12.1,
            textColor=INK,
        ),
        ParagraphStyle(
            name="Role",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.4,
            leading=11.5,
            textColor=INK,
        ),
        ParagraphStyle(
            name="Meta",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.1,
            leading=10.2,
            textColor=MUTED,
        ),
        ParagraphStyle(
            name="Date",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.1,
            leading=10.2,
            alignment=TA_LEFT,
            textColor=ACCENT,
        ),
        ParagraphStyle(
            name="ResumeBullet",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.7,
            leading=12.1,
            textColor=INK,
            leftIndent=10,
            firstLineIndent=-7,
            bulletIndent=2,
            spaceBefore=1,
            spaceAfter=0,
        ),
        ParagraphStyle(
            name="Compact",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.4,
            leading=11.3,
            textColor=INK,
            spaceAfter=2.5,
        ),
        ParagraphStyle(
            name="Proof",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.6,
            leading=11,
            textColor=ACCENT,
            alignment=TA_CENTER,
        ),
    ]
    for style in definitions:
        styles.add(style)
    return styles


STYLES = create_styles()


def require_string(value, path):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{path} must be a non-empty string")


def require_url(value, path):
    require_string(value, path)
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError(f"{path} must be an absolute HTTP(S) URL")


def validate_items(items, path, fields):
    if not isinstance(items, list):
        raise ValueError(f"{path} must be an array")
    for index, item in enumerate(items):
        item_path = f"{path}[{index}]"
        if not isinstance(item, dict):
            raise ValueError(f"{item_path} must be an object")
        for field in fields:
            require_string(item.get(field), f"{item_path}.{field}")


def validate_data(data):
    """Fail fast with actionable paths before the public PDF is touched."""
    if not isinstance(data, dict):
        raise ValueError("resume data must be a JSON object")

    metadata = data.get("metadata")
    person = data.get("person")
    experience = data.get("experience")
    proof = data.get("proof")
    if not isinstance(metadata, dict):
        raise ValueError("metadata must be an object")
    if not isinstance(person, dict):
        raise ValueError("person must be an object")
    if not isinstance(experience, dict):
        raise ValueError("experience must be an object")
    if not isinstance(proof, dict):
        raise ValueError("proof must be an object")

    for field in ("title", "subject"):
        require_string(metadata.get(field), f"metadata.{field}")
    for field in ("name", "headline", "location", "phone", "email"):
        require_string(person.get(field), f"person.{field}")
    require_string(data.get("profile"), "profile")
    require_string(proof.get("label"), "proof.label")
    require_url(proof.get("url"), "proof.url")

    validate_items(person.get("links"), "person.links", ("label", "url"))
    for index, item in enumerate(person["links"]):
        require_url(item["url"], f"person.links[{index}].url")

    facts = proof.get("facts")
    if not isinstance(facts, list) or not facts:
        raise ValueError("proof.facts must be a non-empty array")
    for index, fact in enumerate(facts):
        require_string(fact, f"proof.facts[{index}]")

    for group in ("primary", "earlier"):
        roles = experience.get(group)
        validate_items(
            roles,
            f"experience.{group}",
            ("title", "company", "dates", "location"),
        )
        for index, item in enumerate(roles):
            bullets = item.get("bullets")
            if not isinstance(bullets, list) or not bullets:
                raise ValueError(
                    f"experience.{group}[{index}].bullets "
                    "must be a non-empty array"
                )
            for bullet_index, bullet in enumerate(bullets):
                require_string(
                    bullet,
                    f"experience.{group}[{index}].bullets[{bullet_index}]",
                )

    validate_items(
        data.get("independentDelivery"),
        "independentDelivery",
        ("name", "description"),
    )
    validate_items(data.get("skills"), "skills", ("group", "items"))
    validate_items(
        data.get("certifications"),
        "certifications",
        ("name", "issuer", "dates"),
    )
    for index, item in enumerate(data["certifications"]):
        if "url" in item:
            require_url(item["url"], f"certifications[{index}].url")
    validate_items(
        data.get("education"),
        "education",
        ("degree", "institution", "dates", "details"),
    )


def load_data(path):
    try:
        with path.open(encoding="utf-8") as stream:
            data = json.load(stream)
    except json.JSONDecodeError as error:
        raise ValueError(
            f"{path}:{error.lineno}:{error.colno}: {error.msg}"
        ) from error
    validate_data(data)
    return data


def link(label, url, color="#176B62"):
    return (
        f'<link href="{escape(url, quote=True)}" color="{color}">'
        f"<u>{label}</u></link>"
    )


def section(title):
    return [
        Paragraph(escape(title.upper()), STYLES["Section"]),
        HRFlowable(
            width="100%",
            thickness=0.55,
            color=RULE,
            spaceBefore=0,
            spaceAfter=4,
        ),
    ]


def role(item):
    heading = Table(
        [
            [
                Paragraph(escape(item["title"]), STYLES["Role"]),
                Paragraph(escape(item["dates"]), STYLES["Date"]),
            ],
            [
                Paragraph(
                    f'{escape(item["company"])} | {escape(item["location"])}',
                    STYLES["Meta"],
                ),
                "",
            ],
        ],
        colWidths=[139 * mm, 39 * mm],
        hAlign="LEFT",
    )
    heading.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    items = [heading, Spacer(1, 1)]
    items.extend(
        Paragraph(f"- {escape(bullet)}", STYLES["ResumeBullet"])
        for bullet in item["bullets"]
    )
    items.append(Spacer(1, 5))
    return KeepTogether(items)


def label_value(label, value):
    return Paragraph(
        f'<font name="Helvetica-Bold" color="#17211F">'
        f"{escape(label)}:</font> {escape(value)}",
        STYLES["Compact"],
    )


def page_footer(canvas, doc, name):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.45)
    canvas.line(doc.leftMargin, 14 * mm, A4[0] - doc.rightMargin, 14 * mm)
    canvas.setFont("Helvetica", 7.4)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 9.5 * mm, name)
    canvas.drawRightString(
        A4[0] - doc.rightMargin,
        9.5 * mm,
        f"Resume | Page {doc.page}",
    )
    canvas.restoreState()


def certification_cell(item):
    title = f"<b>{escape(item['name'])}</b>"
    if item.get("url"):
        title = link(title, item["url"])
    return Paragraph(
        title
        + "<br/>"
        + f'<font color="#52605D">{escape(item["issuer"])} | '
        + f'{escape(item["dates"])}</font>',
        STYLES["Compact"],
    )


def two_column_rows(items):
    rows = []
    for index in range(0, len(items), 2):
        left = items[index]
        right = items[index + 1] if index + 1 < len(items) else ""
        rows.append([left, right])
    return rows


def build(data, output):
    output.parent.mkdir(parents=True, exist_ok=True)
    metadata = data["metadata"]
    person = data["person"]
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=13 * mm,
        bottomMargin=18 * mm,
        title=metadata["title"],
        author=person["name"],
        subject=metadata["subject"],
        creator=person["name"],
    )

    contact_line = (
        f'{escape(person["location"])} &nbsp;&nbsp;|&nbsp;&nbsp; '
        f'{escape(person["phone"])} &nbsp;&nbsp;|&nbsp;&nbsp; '
        + link(
            escape(person["email"]),
            f'mailto:{person["email"]}',
        )
    )
    links_line = " &nbsp;&nbsp;|&nbsp;&nbsp; ".join(
        link(escape(item["label"]), item["url"])
        for item in person["links"]
    )
    story = [
        Paragraph(escape(person["name"]), STYLES["ResumeName"]),
        Paragraph(escape(person["headline"]), STYLES["ResumeTitle"]),
        Paragraph(contact_line, STYLES["Contact"]),
        Paragraph(links_line, STYLES["Contact"]),
        Spacer(1, 7),
    ]

    story.extend(section("Profile"))
    story.extend(
        [
            Paragraph(escape(data["profile"]), STYLES["Body"]),
            Spacer(1, 5),
        ]
    )
    proof = data["proof"]
    proof_html = link(escape(proof["label"]), proof["url"])
    if proof["facts"]:
        proof_html += " &nbsp;&nbsp;|&nbsp;&nbsp; " + (
            " &nbsp;&nbsp;|&nbsp;&nbsp; ".join(
                escape(item) for item in proof["facts"]
            )
        )
    story.append(
        Table(
            [[Paragraph(proof_html, STYLES["Proof"])]],
            colWidths=[178 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), PALE),
                    ("BOX", (0, 0), (-1, -1), 0.5, RULE),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ("LEFTPADDING", (0, 0), (-1, -1), 5),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ]
            ),
        )
    )

    story.extend(section("Experience"))
    story.extend(role(item) for item in data["experience"]["primary"])

    story.append(PageBreak())
    story.extend(section("Earlier Experience"))
    story.extend(role(item) for item in data["experience"]["earlier"])

    if data["independentDelivery"]:
        story.extend(section("Selected Independent Delivery"))
        story.extend(
            label_value(item["name"], item["description"])
            for item in data["independentDelivery"]
        )

    story.extend(section("Technical Skills"))
    story.extend(
        label_value(item["group"], item["items"])
        for item in data["skills"]
    )

    if data["certifications"]:
        story.extend(section("Certifications"))
        cert_table = Table(
            two_column_rows(
                [
                    certification_cell(item)
                    for item in data["certifications"]
                ]
            ),
            colWidths=[88 * mm, 88 * mm],
            hAlign="LEFT",
        )
        cert_table.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                    ("TOPPADDING", (0, 0), (-1, -1), 1),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ]
            )
        )
        story.append(cert_table)

    story.extend(section("Education"))
    education_rows = []
    for item in data["education"]:
        details = escape(item["institution"])
        if item["details"]:
            details += f' | {escape(item["details"])}'
        education_rows.append(
            [
                Paragraph(
                    f'<b>{escape(item["degree"])}</b><br/>'
                    f'<font color="#52605D">{details}</font>',
                    STYLES["Compact"],
                ),
                Paragraph(escape(item["dates"]), STYLES["Date"]),
            ]
        )
    story.append(
        Table(
            education_rows,
            colWidths=[139 * mm, 39 * mm],
            style=TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            ),
        )
    )

    footer = lambda canvas, doc: page_footer(canvas, doc, person["name"])
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Render data/resume.json into the portfolio resume PDF."
    )
    parser.add_argument(
        "--data",
        type=Path,
        default=DEFAULT_DATA,
        help=f"resume JSON path (default: {DEFAULT_DATA})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"generated PDF path (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--publish",
        action="store_true",
        help="also replace public/resume.pdf after successful generation",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    data_path = args.data.resolve()
    output_path = args.output.resolve()
    data = load_data(data_path)
    build(data, output_path)
    print(f"Generated {output_path}")
    if args.publish:
        PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(output_path, PUBLIC_OUTPUT)
        print(f"Published {PUBLIC_OUTPUT}")


if __name__ == "__main__":
    main()
