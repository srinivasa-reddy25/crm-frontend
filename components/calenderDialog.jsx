"use client";

import React, { useState } from "react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarDialog({ onApply }) {
    const [open, setOpen] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: new Date(2025, 5, 9),
        to: new Date(2025, 5, 26),
    });

    const handleApply = () => {
        if (!dateRange?.from || !dateRange?.to) return;

        const start = new Date(dateRange.from);
        start.setHours(0, 0, 0, 0);

        const end = new Date(dateRange.to);
        end.setHours(23, 59, 59, 999);

        onApply?.({ from: start, to: end });
        // console.log("Selected Date Range:", dateRange);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Select Date Range</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md" >
                <DialogHeader>
                    <DialogTitle>Select a Date Range</DialogTitle>
                </DialogHeader>

                <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    className="rounded-lg border shadow-sm"
                />

                <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleApply}>Apply</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
