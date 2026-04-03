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

    const checkauth = await prisma.idea.findFirst({
        where: {
            ownerId: adminId
        }
    })
    const checkrequest = await prisma.joinrequest.findFirst({
        where: {
            id: joinid,
            ideaId: checkauth.id
        }
    })
    if (!checkrequest && !checkauth) {
        return res.status(400).json({ message: "something went wrong please try again" })
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
        return res.status(200).json({ message: "request has been approved" })
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

    const getposts = await prisma.joinrequest.findMany({
        where: {
            ideaId: projectid
        }
    })
    return res.status(200).json({ message: getposts })


}