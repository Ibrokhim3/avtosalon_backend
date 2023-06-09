//GET-CATEGORIES

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The categories managing API
 * /avtosalon/get-categories:
 *   get:
 *     summary: Lists of all categories(car brands)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: The list of the users
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad  request
 *       500:
 *         description:  Internal server error
 *
 */

//GET_ONE_CATEGORY

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The categories managing API
 * /avtosalon/get-categories/{id}:
 *   get:
 *     summary: Get all cars related to one category(car brands)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *          required: true
 *          description: id of the category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: The list of the users
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad  request
 *       500:
 *         description:  Internal server error
 *
 */

//ADD-CATEGORY

/**
 * @swagger
 * components:
 *   schemas:
 *     categoryAddSchema:
 *       type: object
 *       required:
 *         - categoryName
 *         - categoryImg
 *       properties:
 *         categoryName:
 *           type: string
 *           description: Category title
 *           categoryImg:
 *            type: String
 *            format: binary
 *
 *       example:
 *         categoryName: BYD (BUILD YOUR DREAMS)
 *         categoryImg: File
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The Categories managing API
 * /avtosalon/add-category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     parameters:
 *     - in: header
 *     name: token
 *     schema:
 *       type: string
 *       required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                categoryName:
 *                  type: string
 *                categoryImg:
 *                  type: string
 *                  format: binary
 *     responses:
 *       201:
 *         description: Category added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/categoryAddSchema'
 *       400:
 *          description: Bad reques, fill the form correctly
 *       500:
 *         description: Internal server error
 *
 */

//UPDATE-CATEGORY

/**
 * @swagger
 * components:
 *   schemas:
 *     categoryUpdateSchema:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         categoryName:
 *           type: string
 *           description: User's id
 *         id:
 *           type: string
 *           description: Category id
 *         profileImg:
 *           type: String
 *           format: binary
 *
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The Categories managing API
 * /avtosalon/update-category:
 *   put:
 *     summary: Update category by admin
 *     tags: [Categories]
 *     parameters:
 *     - in: header
 *       name: token
 *       schema:
 *         type: string
 *         required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                id:
 *                  type: string
 *                  description: category id
 *                categoryName:
 *                  type: string
 *                categoryImg:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: Updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/categoryUpdateSchema'
 *       400:
 *          description: Bad request
 *       500:
 *         description: Internal server error
 *
 */

//DELETE CATEGORY

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The Categories managing API
 * /avtosalon/delete-category:
 *   delete:
 *     summary: Delete category by admin and self-delete
 *     tags: [Categories]
 *     parameters:
 *     - in: header
 *       name: token
 *       schema:
 *         type: string
 *         required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                id:
 *                  type: string
 *     responses:
 *       200:
 *         description: Category was deleted.
 *       400:
 *         description: Bad request
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 *
 */
