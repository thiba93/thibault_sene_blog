import BaseModel from "@/db/models/BaseModel"
import CategoryModel from "@/db/models/CategoryModel"
import UserModel from "@/db/models/UserModel"

class ProductModel extends BaseModel {
  static tableName = "products"
  static get relationMappings() {
    return {
      category: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: CategoryModel,
        join: {
          from: "products.categoryId",
          to: "categories.id",
        },
      },
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "products.userId",
          to: "users.id",
        },
      },
    }
  }
}

export default ProductModel
