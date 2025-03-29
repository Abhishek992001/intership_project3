import express, { Request, Response } from "express";
import Event from "../models/eventModel";  

const router = express.Router();

// 🟢 Admin - Edit Event
router.patch("/:eventId", async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const updateData = req.body;

        const updatedEvent = await Event.findOneAndUpdate({ eventId }, updateData, { new: true });

        if (!updatedEvent) {
             res.status(404).json({ error: "Event not found" });
             return;
        }

        console.log("✅ Event updated successfully:", updatedEvent);
        res.status(200).json(updatedEvent);
    } catch (error: any) {
        console.error("❌ Error updating event:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;