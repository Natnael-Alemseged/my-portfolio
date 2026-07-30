#!/usr/bin/env python3
"""Generate the public, ATS-friendly resume PDF."""

from pathlib import Path

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
OUTPUT = ROOT / "output" / "pdf" / "natnael-alemseged-resume.pdf"

INK = colors.HexColor("#17211F")
MUTED = colors.HexColor("#52605D")
ACCENT = colors.HexColor("#176B62")
PALE = colors.HexColor("#EAF4F1")
RULE = colors.HexColor("#C9D6D2")
WHITE = colors.white


def link(label: str, url: str, color: str = "#176B62") -> str:
    return f'<link href="{url}" color="{color}"><u>{label}</u></link>'


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="ResumeName",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=23,
        leading=25,
        textColor=INK,
        alignment=TA_CENTER,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11.5,
        leading=14,
        textColor=ACCENT,
        alignment=TA_CENTER,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Contact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=11.2,
        textColor=MUTED,
        alignment=TA_CENTER,
    )
)
styles.add(
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
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.7,
        leading=12.1,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        name="Role",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.4,
        leading=11.5,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        name="Meta",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.1,
        leading=10.2,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="Date",
        parent=styles["Meta"],
        alignment=TA_LEFT,
        fontName="Helvetica-Bold",
        textColor=ACCENT,
    )
)
styles.add(
    ParagraphStyle(
        name="ResumeBullet",
        parent=styles["Body"],
        leftIndent=10,
        firstLineIndent=-7,
        bulletIndent=2,
        spaceBefore=1,
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        name="Compact",
        parent=styles["Body"],
        fontSize=8.4,
        leading=11.3,
        spaceAfter=2.5,
    )
)
styles.add(
    ParagraphStyle(
        name="Proof",
        parent=styles["Body"],
        fontName="Helvetica-Bold",
        fontSize=8.6,
        leading=11,
        textColor=ACCENT,
        alignment=TA_CENTER,
    )
)
styles.add(
    ParagraphStyle(
        name="Footer",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        textColor=MUTED,
        alignment=TA_CENTER,
    )
)


def section(title: str):
    return [
        Paragraph(title.upper(), styles["Section"]),
        HRFlowable(
            width="100%",
            thickness=0.55,
            color=RULE,
            spaceBefore=0,
            spaceAfter=4,
        ),
    ]


def role(
    title: str,
    company: str,
    dates: str,
    location: str,
    bullets: list[str],
):
    heading = Table(
        [
            [
                Paragraph(title, styles["Role"]),
                Paragraph(dates, styles["Date"]),
            ],
            [
                Paragraph(f"{company} | {location}", styles["Meta"]),
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
        Paragraph(f"- {bullet}", styles["ResumeBullet"])
        for bullet in bullets
    )
    items.append(Spacer(1, 5))
    return KeepTogether(items)


def label_value(label: str, value: str):
    return Paragraph(
        f'<font name="Helvetica-Bold" color="#17211F">{label}:</font> {value}',
        styles["Compact"],
    )


def page_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.45)
    canvas.line(doc.leftMargin, 14 * mm, A4[0] - doc.rightMargin, 14 * mm)
    canvas.setFont("Helvetica", 7.4)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 9.5 * mm, "Natnael Alemseged Astaw")
    canvas.drawRightString(
        A4[0] - doc.rightMargin,
        9.5 * mm,
        f"Resume | Page {doc.page}",
    )
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=13 * mm,
        bottomMargin=18 * mm,
        title="Natnael Alemseged Astaw - Resume",
        author="Natnael Alemseged Astaw",
        subject="AI Agent and Forward-Deployed Engineer resume",
        creator="Natnael Alemseged Astaw",
    )

    story = [
        Paragraph("Natnael Alemseged Astaw", styles["ResumeName"]),
        Paragraph(
            "AI Agent &amp; Forward-Deployed Engineer | Senior Full-Stack Developer",
            styles["ResumeTitle"],
        ),
        Paragraph(
            "Addis Ababa, Ethiopia &nbsp;&nbsp;|&nbsp;&nbsp; +251 961 261 683 "
            "&nbsp;&nbsp;|&nbsp;&nbsp; "
            + link("natiaabaydam@gmail.com", "mailto:natiaabaydam@gmail.com"),
            styles["Contact"],
        ),
        Paragraph(
            link("Portfolio", "https://natnaelalemseged.com")
            + " &nbsp;&nbsp;|&nbsp;&nbsp; "
            + link(
                "LinkedIn",
                "https://www.linkedin.com/in/natnael-alemseged",
            )
            + " &nbsp;&nbsp;|&nbsp;&nbsp; "
            + link(
                "GitHub",
                "https://github.com/Natnael-Alemseged",
            )
            + " &nbsp;&nbsp;|&nbsp;&nbsp; "
            + link(
                "Upwork",
                "https://www.upwork.com/freelancers/~01284b1ed914761198",
            ),
            styles["Contact"],
        ),
        Spacer(1, 7),
    ]

    story.extend(section("Profile"))
    story.extend(
        [
            Paragraph(
                "Software engineer with 4+ years of experience shipping production AI, "
                "web, and mobile products. Builds agentic systems, RAG and evaluation "
                "pipelines, LLM-powered APIs, and polished cross-platform applications "
                "using Python, TypeScript, Flutter, and AWS. Experienced in taking "
                "ambiguous product requirements from discovery through deployment, "
                "observability, and iteration.",
                styles["Body"],
            ),
            Spacer(1, 5),
            Table(
                [
                    [
                        Paragraph(
                            link(
                                "UPWORK TOP RATED",
                                "https://www.upwork.com/freelancers/~01284b1ed914761198",
                                "#176B62",
                            )
                            + " &nbsp;&nbsp;|&nbsp;&nbsp; 100% Job Success "
                            "&nbsp;&nbsp;|&nbsp;&nbsp; $7K+ earned "
                            "&nbsp;&nbsp;|&nbsp;&nbsp; 3 completed engagements",
                            styles["Proof"],
                        )
                    ]
                ],
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
            ),
        ]
    )

    story.extend(section("Experience"))
    story.append(
        role(
            "Senior Software Engineer",
            "Hire Armada",
            "Jul 2025 - Present",
            "United States (Remote)",
            [
                "Engineer AI-driven backends and product features with Node.js, "
                "FastAPI, Next.js, Flutter, Prisma, LangGraph, MCP, Composio, and "
                "vector memory.",
                "Built a social discovery platform backend supporting 10K+ daily "
                "active users, real-time matching and messaging, and 99.9% uptime.",
                "Shipped a personalized affirmation product with Gemini chat, "
                "home-screen widgets, and adaptive feeds, increasing retention by 35%.",
                "Delivered an agentic collaboration workspace with real-time events, "
                "email automation, semantic search, and tagged agents, improving "
                "team productivity by 20%.",
            ],
        )
    )
    story.append(
        role(
            "Senior Full-Stack Developer",
            "Startup Agile",
            "Jan 2025 - May 2026",
            "United States (Remote)",
            [
                "Led Next.js, React, React Native, and Expo delivery across web and "
                "mobile products; completed milestones 15% ahead of schedule.",
                "Implemented OTA updates, deep linking, Firebase notifications, "
                "Google Maps, AI assistants, and product analytics while reducing "
                "mobile load time by 35%.",
                "Improved Next.js rendering, SEO, and Core Web Vitals, contributing "
                "to 50%+ web traffic growth and a 30% performance improvement.",
                "Standardized TypeScript, tRPC, Prisma, Playwright, and Detox workflows, "
                "reducing production defects by 65%.",
            ],
        )
    )
    story.append(
        role(
            "AI Engineer",
            "DataCore Software",
            "Jan 2025 - Aug 2025",
            "United States (Remote, Contract)",
            [
                "Built FastAPI services for real-time detection, recognition, "
                "transcription, summarization, and translation using self-hosted LLMs.",
                "Deployed containerized inference workloads to AWS EKS with sub-200 ms "
                "inference and 99.9% uptime at peak load.",
                "Fine-tuned open models and optimized GPU inference with TensorRT and "
                "ECR images, reducing cost by 12%; automated delivery with Terraform "
                "and GitHub Actions.",
            ],
        )
    )
    story.append(
        role(
            "Senior Mobile Developer",
            "Qemer Software Technology PLC",
            "Aug 2024 - Sep 2025",
            "Addis Ababa, Ethiopia (On-site)",
            [
                "Led delivery of 10+ Flutter and Ionic applications, accelerating "
                "release cycles by 40%.",
                "Improved application architecture and runtime performance, cutting "
                "load times by up to 50%.",
                "Mentored junior engineers and established reusable delivery patterns, "
                "reducing onboarding time by 30%.",
            ],
        )
    )

    story.append(PageBreak())
    story.extend(section("Earlier Experience"))
    story.append(
        role(
            "ERP Functional Consultant",
            "Red Cloud ICT Solutions",
            "Mar 2023 - Sep 2024",
            "Addis Ababa, Ethiopia",
            [
                "Progressed from Junior Consultant to Functional Consultant Assistant, "
                "supporting ERP discovery, configuration, testing, user enablement, "
                "and implementation delivery.",
            ],
        )
    )
    story.append(
        role(
            "Freelance Web Developer",
            "Independent",
            "Aug 2022 - Mar 2023",
            "Remote",
            [
                "Designed, built, and delivered responsive web solutions directly "
                "with clients from requirements through launch.",
            ],
        )
    )

    story.extend(section("Selected Independent Delivery"))
    story.extend(
        [
            label_value(
                "Social Music Party Game",
                "Delivered a complete client product engagement from Jan-Jun 2026; "
                "received a verified 5.0 Upwork rating.",
            ),
            label_value(
                "AI Chatbot Engineering",
                "Completed a focused AI chatbot engagement in Jan 2026; received a "
                "verified 5.0 Upwork rating.",
            ),
            label_value(
                "Flutter Inventory Tracker",
                "Shipped and supported a cross-platform inventory application in "
                "2025; received a verified 5.0 Upwork rating.",
            ),
        ]
    )

    story.extend(section("Technical Skills"))
    story.extend(
        [
            label_value(
                "AI & Agents",
                "LangGraph, LangChain, RAG, agent orchestration, AI evaluation, "
                "prompt engineering, MCP, Composio, vector databases, Weaviate, "
                "Pinecone, self-hosted LLMs",
            ),
            label_value(
                "Backend & Data",
                "Python, FastAPI, Node.js, Express.js, TypeScript, PostgreSQL, "
                "MongoDB, Redis, Supabase, Firebase, Prisma, GraphQL, REST APIs, "
                "Socket.io",
            ),
            label_value(
                "Web & Mobile",
                "Next.js, React, React Native, Expo, Flutter, Dart, Ionic, "
                "Redux Toolkit, TanStack Query, BLoC",
            ),
            label_value(
                "Cloud & Delivery",
                "AWS, Docker, Kubernetes/EKS, Terraform, GitHub Actions, "
                "Prometheus, Grafana, CI/CD, microservices, n8n",
            ),
        ]
    )

    story.extend(section("Certifications"))
    certs = [
        [
            Paragraph(
                "<b>AI Agent Engineering, AI Evaluation &amp; "
                "Forward-Deployed Engineering</b><br/>"
                '<font color="#52605D">10 Academy | Issued May 2026</font>',
                styles["Compact"],
            ),
            Paragraph(
                link(
                    "<b>AWS Certified Solutions Architect - Associate</b>",
                    "https://www.credly.com/badges/c7124dca-2df4-4c93-abc9-b1c0027d99b4/linked_in_profile",
                )
                + '<br/><font color="#52605D">AWS | Feb 2024 - Feb 2027</font>',
                styles["Compact"],
            ),
        ],
        [
            Paragraph(
                "<b>AWS Certified Cloud Practitioner</b><br/>"
                '<font color="#52605D">AWS | Oct 2023 - Feb 2027</font>',
                styles["Compact"],
            ),
            Paragraph(
                link(
                    "<b>Founders Academy</b>",
                    "https://intranet.alxswe.com/certificates/eXC3Nyc9TR",
                )
                + '<br/><font color="#52605D">ALX Africa | Issued Jul 2024</font>',
                styles["Compact"],
            ),
        ],
        [
            Paragraph(
                "<b>CCNA: Introduction to Networks</b><br/>"
                '<font color="#52605D">Cisco | Issued Nov 2021</font>',
                styles["Compact"],
            ),
            "",
        ],
    ]
    cert_table = Table(certs, colWidths=[88 * mm, 88 * mm], hAlign="LEFT")
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
    story.append(
        Table(
            [
                [
                    Paragraph(
                        "<b>Bachelor of Science in Information Systems</b><br/>"
                        '<font color="#52605D">Hawassa University | GPA: 3.57</font>',
                        styles["Compact"],
                    ),
                    Paragraph("Jan 2018 - Dec 2022", styles["Date"]),
                ]
            ],
            colWidths=[139 * mm, 39 * mm],
            style=TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            ),
        )
    )

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    print(OUTPUT)


if __name__ == "__main__":
    build()
