import { prisma } from "../lib/prisma.js"


export const SendJoinResquest = async (req, res) => {
    const { projectid } = req.params;
    const userId = req.user.id;
    const open = "open";

    const IdeaExists = await prisma.idea.findFirst({
        where: {
            id: projectid,
            status: open
        }
    })
    const UserExists = await prisma.profile.findFirst({
        where: {
            userId: userId
        }
    })

    if (!IdeaExists && !UserExists) {
        return res.status(401).json({ error: "something went wrong" })
    }



    if (IdeaExists.ownerId === userId) {
        return res.status(401).json({ error: "admin can't send requests to their projects" })
    }

    const CreateRequest = await prisma.joinrequest.create({
        data: {
            status: "pending",
            ideaId: projectid,
            userId: userId
        }
    })
    return res.status(200).json({ message: "success" })
}

export const JoinRequest = async (req, res) => {
    const { data } = req.body;
    const { joinid } = req.params;
    const adminId = req.user.id;

    const checkrequest = await prisma.joinrequest.findFirst({
        where: {
            id: joinid
        }
    })
    if (!checkrequest) {
        return res.status(400).json({ message: "request not found" })
    }

    const checkauth = await prisma.idea.findFirst({
        where: {
            ownerId: adminId,
            id: checkrequest.ideaId
        }
    })

    if (!checkauth) {
        return res.status(400).json({ message: "admin not found" })
    }

    if (data === "accepted") {
        const accept = await prisma.joinrequest.update({
            where: {
                id: joinid
            },
            data: {
                status: "accepted"
            }
        })
        const checkmember = await prisma.member.findFirst({
            where: {
                memberId: accept.userId
            }
        })
        const getprofile = await prisma.profile.findFirst({
            where: {
                userId: accept.userId
            }
        })

        if (checkmember) {
            return res.status(400).json({ message: `${getprofile.displayname} is already part of your team` })
        }
        const addMember = await prisma.member.create({
            data: {
                memberId: checkrequest.userId,
                ideaId: checkauth.id
            }
        })
        return res.status(200).json({ message: "request has been accepted" })
    }
    else if (data === "rejected") {
        const reject = await prisma.joinrequest.update({
            where: {
                id: joinid
            },
            data: {
                status: "rejected"
            }
        })
        return res.status(200).json({ message: "request has been ignored" })
    }
}

export const join_notification = async (req, res) => {
    const id = req.user.id;
    const { projectid } = req.params;

    const checkadmin = await prisma.idea.findFirst({
        where: {
            ownerId: id,
            id: projectid
        }
    })

    if (!checkadmin) {
        return res.status(400).json({ message: "something went wrong" })
    }

    const getpostsnotifications = await prisma.joinrequest.findMany({
        where: {
            ideaId: projectid
        }
    })
    return res.status(200).json({ message: getpostsnotifications })


}

export const report = async (req, res) => {
    const reporter = req.user.id;
    const { targetid } = req.params;
    const { projectid } = req.params;
    const { report } = req.body;

    const checkidea = await prisma.idea.findUnique({
        where: {
            id: projectid
        }
    })
    if (!checkidea) {
        return res.status(400).json({ message: "idea post not found" })
    }
    const checkuser = await prisma.user.findFirst({
        where: {
            id: {
                in: [targetid, reporter]
            }
        }
    })
    if (!checkuser) {
        return res.status(400).json({ message: "user not found" })
    }
    console.log(report);

    const createraport = await prisma.report.create({
        data: {
            reporterId: reporter,
            targetuserId: targetid,
            targetideaId: projectid,
            reason: report,
            status: "pending"
        }
    })
    return res.status(200).json({ message: "report has been sent admin now can take action" })

}

export const report_notification = async (req, res) => {
    const admin = req.user.id;

    const check_admin = await prisma.idea.findMany({
        where: {
            ownerId: admin
        }
    })
    if (!check_admin) {
        return res.status(400).json({})
    }
    const check_reports = await prisma.report.findMany({
        where: {
            targetideaId: check_admin.id
        }
    })
    if (!check_reports) {
        return res.status(400).json({})
    }
    return res.status(200).json({ message: check_reports || null })
}

export const handle_report_delete = async (req, res) => {
    const admin = req.user.id;
    const { reportid } = req.params;
    const {data} = req.body;

    const check_idea = await prisma.idea.findFirst({
        where: {
            ownerId: admin
        }
    })
    if (!check_idea) {
        return res.status(400).json({ error: "this user don't have any idea posted" })
    }
    const check_report = await prisma.report.findFirst({
        where: {
            id: reportid,
            targetideaId: check_idea.id
        }
    })
    if (!check_report) {
        return res.status(400).json({ error: "couldn't find report" })
    }
    if (data === "resolved") {
        const deletemember = await prisma.member.deleteMany({
            where: {
                memberId: check_report.targetuserId
            }
        })
        const updatereport = await prisma.report.update({
            where: {
                id: reportid,
                targetideaId: check_idea.id
            },
            data: {
                status: "resolved"
            }
        })
        if (deletemember && updatereport) {
            return res.status(200).json({ message: "report resolved" })
        }
        else {
            return res.status(400).json({ error: "something went wrong please try again" })
        }
    }
    else if(data !== "resolved") {
        return res.status(400).json({ error: "error try again" })
    }
}
export const handle_report = async (req, res) => {
    const admin = req.user.id;
    const { reportid } = req.params;
    const {data} = req.body;

    const check_idea = await prisma.idea.findFirst({
        where: {
            ownerId: admin
        }
    })
    if (!check_idea) {
        return res.status(400).json({ error: "this user don't have any idea posted" })
    }
    const check_report = await prisma.report.findUnique({
        where: {
            id: reportid,
            targetideaId: check_idea.id
        }
    })
    if (!check_report) {
        return res.status(400).json({ error: "couldn't find report" })
    }
    if (data === "ignored") {
        const updatereport = await prisma.report.update({
            where: {
                id: reportid,
                targetideaId: check_idea.id
            },
            data: {
                status: "ignored"
            }
        })
        if (updatereport) {
            return res.status(200).json({ message: "report ignored" })
        }
        else {
            return res.status(400).json({ error: "something went wrong please try again" })
        }
    }
}