export const invitations = [
    {
        _id: "inv1",
        email: "new.admin@stayup.com",
        role: "admin",
        status: "PENDING",
        invited_by: "Vladislaus Draguila",
        token: "tok_abc123",
        expires_at: "2026-04-01T00:00:00Z",
        created_at: "2026-03-01T10:00:00Z"
    },
    {
        _id: "inv2",
        email: "moderator@stayup.com",
        role: "moderator",
        status: "ACCEPTED",
        invited_by: "Emeka Okafor",
        token: "tok_def456",
        expires_at: "2026-03-15T00:00:00Z",
        created_at: "2026-02-15T09:00:00Z"
    },
    {
        _id: "inv3",
        email: "vendor.partner@example.com",
        role: "vendor",
        status: "EXPIRED",
        invited_by: "Amara Nwosu",
        token: "tok_ghi789",
        expires_at: "2026-02-01T00:00:00Z",
        created_at: "2026-01-15T11:30:00Z"
    }
];
