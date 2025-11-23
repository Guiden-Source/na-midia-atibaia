"use client";

export default function DeliveryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="lg:pb-0">
            {children}
        </div>
    );
}
