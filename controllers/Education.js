
const EducationLevel = require('../schemas/EducationLevel');
const Subject = require('../schemas/Subject');

exports.createEducationLevelWithSubjects = async (req, res) => {
    try {
        const { name, subjects } = req.body;

        if (!name || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: 'Vui lòng cung cấp name và mảng subjects' });
        }

        const allowedNames = ['grade2', 'grade3', 'university', 'none'];
        if (!allowedNames.includes(name)) {
            return res.status(400).json({ message: 'Tên cấp học không hợp lệ. Chỉ cho phép: ' + allowedNames.join(', ') });
        }

        // Tạo EducationLevel rỗng trước
        const educationLevel = new EducationLevel({ name, subjects: [] });
        await educationLevel.save();

        // Tạo các subject liên quan
        const createdSubjects = await Promise.all(
            subjects.map(subjectName => {
                const newSubject = new Subject({
                    name: subjectName,
                    educationLevel: educationLevel._id
                });
                return newSubject.save();
            })
        );

        // Cập nhật EducationLevel với danh sách subject ID
        educationLevel.subjects = createdSubjects.map(s => s._id);
        await educationLevel.save();

        res.status(201).json({
            message: 'Tạo cấp học và môn học thành công',
            data: educationLevel,
            subjects: createdSubjects
        });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
exports.getAllEducationLevels = async (req, res) => {
    try {
        const levels = await EducationLevel.find().populate('subjects');
        res.json(levels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEducationLevelById = async (req, res) => {
    try {
        const level = await EducationLevel.findById(req.params.id).populate('subjects');
        if (!level) return res.status(404).json({ message: 'Không tìm thấy cấp học' });
        res.json(level);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateEducationLevel = async (req, res) => {
    try {
        const { name, subjects } = req.body;

        const allowedNames = ['grade2', 'grade3', 'university', 'none'];
        if (name && !allowedNames.includes(name)) {
            return res.status(400).json({ message: 'Giá trị name không hợp lệ.' });
        }

        const level = await EducationLevel.findById(req.params.id);
        if (!level) return res.status(404).json({ message: 'Không tìm thấy cấp học' });

        if (name) level.name = name;

        if (subjects && Array.isArray(subjects)) {
            await Subject.deleteMany({ educationLevel: level._id });

            const createdSubjects = await Promise.all(subjects.map(subjectName => {
                const subject = new Subject({ name: subjectName, educationLevel: level._id });
                return subject.save();
            }));

            level.subjects = createdSubjects.map(s => s._id);
        }

        await level.save();
        res.status(200).json({ message: 'Cập nhật thành công', data: level });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

exports.deleteEducationLevel = async (req, res) => {
    try {
        const level = await EducationLevel.findByIdAndDelete(req.params.id);
        if (!level) return res.status(404).json({ message: 'Không tìm thấy cấp học để xóa' });

        await Subject.deleteMany({ educationLevel: level._id });

        res.json({ message: 'Đã xóa cấp học và các môn học liên quan' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};