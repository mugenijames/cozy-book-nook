"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_service_1 = require("../services/email.service");
const router = (0, express_1.Router)();
/* =========================================================
   POST /api/invite
========================================================= */
router.post("/invite", async (req, res) => {
    try {
        const { name, email, phone, program, date, location, message, } = req.body;
        /* -----------------------------------------------------
           VALIDATION
        ----------------------------------------------------- */
        if (!name?.trim()) {
            return res.status(400).json({
                error: "Name is required.",
            });
        }
        if (!email?.trim()) {
            return res.status(400).json({
                error: "Email address is required.",
            });
        }
        if (!program?.trim()) {
            return res.status(400).json({
                error: "Event / program is required.",
            });
        }
        /* -----------------------------------------------------
           FORM DATA
        ----------------------------------------------------- */
        const formData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || "",
            program: program.trim(),
            date: date || "",
            location: location?.trim() || "",
            message: message?.trim() || "",
        };
        console.log("📨 New speaking invitation:", formData);
        /* -----------------------------------------------------
           SEND ADMIN NOTIFICATION
        ----------------------------------------------------- */
        await (0, email_service_1.sendInviteNotification)(formData);
        console.log("✅ Admin speaking notification sent");
        /* -----------------------------------------------------
           SEND CUSTOMER CONFIRMATION
        ----------------------------------------------------- */
        try {
            await (0, email_service_1.sendConfirmationEmail)(formData);
            console.log("✅ Customer confirmation email sent");
        }
        catch (emailError) {
            /*
             * We don't fail the entire request if
             * the customer's confirmation fails.
             *
             * The admin notification has already
             * been delivered.
             */
            console.error("⚠️ Customer confirmation email failed:", emailError);
        }
        /* -----------------------------------------------------
           SUCCESS
        ----------------------------------------------------- */
        return res.status(201).json({
            success: true,
            message: "Speaking request submitted successfully.",
        });
    }
    catch (error) {
        console.error("❌ Speaking invitation error:", error);
        return res.status(500).json({
            success: false,
            error: "Unable to submit speaking request. Please try again.",
        });
    }
});
exports.default = router;
