const categorySchema = require('../schemas/category');

module.exports = {
    // Lấy tất cả danh mục
    getAllCategories: async function () {
        return categorySchema.find({ isDeleted: false }); // Lọc các danh mục không bị xóa
    },

    // Lấy danh mục theo ID
    getCategoryById: async function (id) {
        return categorySchema.findById(id);
    },

    // Tạo danh mục mới
    createCategory: async function (name, description) {
        const newCategory = new categorySchema({
            name: name,
            description: description
        });

        return await newCategory.save(); // Lưu danh mục vào cơ sở dữ liệu
    },

    // Cập nhật danh mục theo ID
    updateCategory: async function (id, body) {
        let updatedCategory = await this.getCategoryById(id); // Tìm danh mục theo ID

        let allowFields = ["name", "description"]; // Các trường cho phép cập nhật
        for (const key of Object.keys(body)) {
            if (allowFields.includes(key)) {
                updatedCategory[key] = body[key]; // Cập nhật các trường hợp lệ
            }
        }
        await updatedCategory.save(); // Lưu lại danh mục sau khi cập nhật
        return updatedCategory;
    },

    // Xóa danh mục (soft delete)
    deleteCategory: async function (id) {
        let category = await this.getCategoryById(id);
        if (category) {
            category.isDeleted = true; // Đánh dấu danh mục là đã xóa
            return await category.save(); // Lưu lại thay đổi
        }
        throw new Error('Danh mục không tồn tại'); // Nếu không tìm thấy danh mục
    }
};
