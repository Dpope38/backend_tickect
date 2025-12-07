import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

/* Department Controllers
@description Get all departments
@route GET /api/v1/admin/departments
@access Private -Admin
*/
const getAllDepartments = async (req, res) => {
    const departments = await prisma.department.findMany({
       include: { 
        tickets: true,
        users: true
       }
    })
    if (!departments || departments.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No departments found"
        });
    }
    res.status(200).json({
        success: true,
        data: departments
    });
}

/* Create a new department
@description Create a new department
@route POST /api/v1/admin/departments
@access Private -Admin
 */

const createDepartment = async (req, res) => {
    const { deptName, details, teamName } = req.body;
    if (!deptName || !details || !teamName) {
        return res.status(400).json({
            success: false,
            message: "Please provide all fields"
        });
    }

    // Check if department already exists
    const existingDepartment = await prisma.department.findUnique({
        where: { deptName },
    });
    if (existingDepartment) {
        return res.status(400).json({
            success: false,
            message: "Department already exists",
        });
    }

    const department = await prisma.department.create({
        data: {
            deptName,
            details,
            teamName
        },
    });

   

    res.status(201).json({
        success: true,
        data: department,
    }); 
}

export { getAllDepartments, createDepartment };