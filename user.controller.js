// import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const register = async (req, res) => {
//   try {
//     const { fullname, email, password } = req.body;
//     if (!fullname || !email || !password) {
//       return res.status(400).json({
//         message: "All fields are required",
//         success: false
//       })
//     }

//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({
//         message: "User already exit with this email"
//       })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({
//       fullname,
//       email,
//       password: hashedPassword
//     });

//     return res.status(201).json({
//       message: "Account created successfully",
//       success: true
//     })

//   } catch (error) {
//     console.log(error)
//   }
// }



// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body
//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required",
//         success: false
//       })
//     };

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         message: "Incorrect email or password",
//         success: false
//       })
//     };

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(400).json({
//         message: "Incorrect email or password",
//         success: false
//       })
//     };

//     const tokenData = {
//       userId: user._id
//     }
//     const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })

//     return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
//       message: `Welcome back ${user.fullname}`,
//       token,
//       user: {
//         _id: user._id,
//         fullname: user.fullname,
//         email: user.email

//       },
//       success: true
//     })

//   } catch (error) {
//     console.log(error);
//   }
// }




// export const logout = async (req, res) => {
//   try {
//     return res.status(200).cookie("token", "", { maxAge: 0 }).json({
//       message: "User logout successfully",
//       success: true
//     })

//   } catch (error) {
//     console.log(error);
//   }

// }





import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------ REGISTER ------------------
export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // 1️⃣ Validate input
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false
      });
    }

    // 3️⃣ Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword
    });

    // 4️⃣ Return success with user info (optional)
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    // 3️⃣ Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d"
    });

    // 5️⃣ Send token in cookie & response
    return res
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production" // only in HTTPS
      })
      .status(200)
      .json({
        message: `Welcome back ${user.fullname}`,
        token,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email
        },
        success: true
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};

// ------------------ LOGOUT ------------------
export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" })
      .status(200)
      .json({
        message: "User logged out successfully",
        success: true
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};
