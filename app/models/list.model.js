module.exports = mongoose => {
    const List = mongoose.model(
        "list",
        mongoose.Schema(
            {
                title: String,
                description: String,
                lastRead: Date,
                lastChap: Number,
                readLink: String,
                _user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user'
                }
            },
            { timestamps: true }
        )
    );
    return List;
};  