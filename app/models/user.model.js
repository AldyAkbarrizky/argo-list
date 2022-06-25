module.exports = mongoose => {
    const User = mongoose.model(
        "user",
        mongoose.Schema(
            {
                username: String,
            },
            { timestamps: true }
        )
    );
    return User;
}