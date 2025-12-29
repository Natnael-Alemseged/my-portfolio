import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';

export async function PATCH(req: NextRequest) {
    try {
        // === Admin Authentication ===
        const adminPassword = req.headers.get('x-admin-password');
        const cookie = req.cookies.get('admin_session');

        const isAuthenticated =
            adminPassword === process.env.ADMIN_PASSWORD ||
            cookie?.value === process.env.ADMIN_PASSWORD;

        if (!isAuthenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // === Connect to DB ===
        await connectToDatabase();

        const { projectIds } = await req.json();

        if (!Array.isArray(projectIds)) {
            return NextResponse.json(
                { error: 'projectIds must be an array' },
                { status: 400 }
            );
        }

        // === Update positions based on order in projectIds array ===
        const updatePromises = projectIds.map((id, index) =>
            Project.findByIdAndUpdate(
                id,

                { position: index },
                { new: true } // return the updated document
            )
        );
        const updatedProjects = await Promise.all(updatePromises);

        // === Log for debugging ===
        console.log(
            updatedProjects.map(p => ({ id: p._id, position: p.position }))
        );

        // === Return updated projects in response ===
        return NextResponse.json({
            success: true,
            message: 'Projects reordered successfully',
            projects: updatedProjects.map(p => ({
                id: p._id,
                position: p.position,
                title: p.title, // optional, include whatever the frontend needs
            })),
        });
    } catch (error) {
        console.error('Error reordering projects:', error);
        return NextResponse.json(
            { error: 'Failed to reorder projects' },
            { status: 500 }
        );
    }
}
