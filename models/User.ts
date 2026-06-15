import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true
    }
)

// Hash password before saving
UserSchema.pre("save", async function () {
    const user = this;

    console.log("🔐 Pre-save hook triggered");
    console.log("🔐 Password modified?:", user.isModified("password"));

    if (!user.isModified("password")) {
        console.log("🔐 Password not modified, skipping hash");
        return;
    }

    console.log("🔐 Hashing password...");
    console.log("🔐 Password before hash:", user.password);

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        console.log("🔐 Password after hash:", user.password);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (password: string) {
    try {
        console.log("Comparing passwords:");
        console.log("Input password:", password);
        console.log("Stored hash:", this.password);
        const result = await bcrypt.compare(password, this.password);
        console.log("Match result:", result);
        return result;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
}

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;