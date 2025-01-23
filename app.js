require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('./database');
const {sendMail} = require('./controllers/sendMail');

const app = express();
app.use(express.json());

connectDB();

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Editor', 'User'], default: 'User' },
    verified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Blog = mongoose.model('Blog', blogSchema);

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);


const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, 'secretKey');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).send('Access Forbidden');
    next();
};

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await user.save();
        sendMail(email);
        res.send({msg:"User Registered Successfully"});
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Email not found');

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: user._id, role: user.role }, 'secretKey');
    res.header('Authorization', token).send({ token });
});

app.post('/blogs', authenticate, authorize(['Admin']), async (req, res) => {
    const { title, content } = req.body;
    const blog = new Blog({ title, content });

    try {
        const savedBlog = await blog.save();
        res.send(savedBlog);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post('/blogs/:id/assign', authenticate, authorize(['Admin']), async (req, res) => {
    const { id } = req.params;
    const { editorId } = req.body;

    try {
        const blog = await Blog.findById(id);
        if (blog.assignedTo) return res.status(400).send('Blog already assigned');

        blog.assignedTo = editorId;
        await blog.save();
        res.send(blog);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put('/blogs/:id', authenticate, authorize(['Editor']), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const blog = await Blog.findById(id);
        if (blog.assignedTo.toString() !== req.user._id)
            return res.status(403).send('Not authorized to edit this blog');

        blog.title = title;
        blog.content = content;
        await blog.save();
        res.send(blog);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.send(blogs);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/comments/:id', authenticate, authorize(['User']), async (req, res) => {
    const { id } = req.params; 

    try {
        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).send('Comment not found');

        if (comment.user.toString() !== req.user._id) {
            return res.status(403).send('Not authorized to delete this comment');
        }

        await comment.remove();
        res.send('Comment deleted successfully');
    } catch (err) {
        res.status(500).send('Server error');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));