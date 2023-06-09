/**
 * @swagger
 * components:
 *   schemas:
 *     usersSchema:
 *       type: object
 *         - userEmail
 *         - password
 *         - password2
 *         - profileImg
 *         - userRole
 *         - publicId
 *         - likedCars
 *         - purchasedCars
 *       properties:
 *         userEmail:
 *           type: string
 *           description: The email of your user
 *         password:
 *           type: string
 *           description: passwordinggizni kiriting
 *         password2:
 *           type: string
 *           description: passwordni takrorlang
 *         profileImg:
 *           type: string
 *           description: The url of the profile image from cloudinary server
 *         userRole:
 *           type: string
 *           description: userRole
 *         publicId:
 *           type: string
 *           description: id from for profile image from cloudinary s
 *         likedCars:
 *           type: array
 *           items:
 *             type: string
 *           description: the list of liked cars
 *         purchasedCars:
 *           type: array
 *           items:
 *             type: string
 *           description: the list of purchased cars of the user
 *       example:
 *         id: 042bc4ff-a5bb-4a22-8456-cd2b6800e55a
 *         userEmail: begzod@gmail.com
 *         password: swagger1234
 *         password2: swagger1234
 *         profileImg: https://res.cloudinary.com/dephdgqpo/image/upload/v1686238532/avtosalo…
 *         userRole: admin
 *         publicId: avtosalon/a7aab4d6-9c4e-43b0-9679-c6c97bf3a972
 *         likedCars: [car1, car2, car3]
 *         purchasedCars: [car1, car2, car3]
 */

// GET_USERS_LIST
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /avtosalon/get-users:
 *   get:
 *     summary: Lists of all users
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *           required: true
 *     description: an authorization header
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/usersSchema'
 *       400:
 *         description: Bad request
 *       500:
 *         description:  Internal server error
 *
 */

// GET_ONE_USER:

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /avtosalon/get-one-user:
 *   get:
 *     summary: Get authorized user's info
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *           required: true
 *     description: an authorization header
 *     responses:
 *       200:
 *         description: Get one user by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/usersSchema'
 *       400:
 *         description: Bad request
 *       500:
 *         description:  Internal server error
 *
 */

//REGISTRATION:

/**
 * @swagger
 * components:
 *   schemas:
 *     userRegistrationSchema:
 *       type: object
 *       required:
 *         - userEmail
 *         - password
 *         - password2
 *       properties:
 *         userEmail:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           description: User's password
 *         password2:
 *           type: string
 *           description: User's password repeating
 *         profileImg:
 *           type: String
 *           format: binary
 *
 *       example:
 *         userEmail: begzod@gmail.com
 *         password: 123$abc
 *         password2: 123$abc
 *         profileImg: File
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /avtosalon/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                userEmail:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *                password2:
 *                  type: string
 *                profileImg:
 *                  type: string
 *                  format: binary
 *     responses:
 *       201:
 *         description: Signup.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userRegistrationSchema'
 *       400:
 *          description: User already exists
 *       500:
 *         description: Internal server error
 *
 */

//LOGIN

/**
 * @swagger
 * components:
 *   schemas:
 *     userLoginSchema:
 *       type: object
 *       required:
 *         - userEmail
 *         - password
 *       properties:
 *         userEmail:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           description: User's password
 *       example:
 *         userEmail: super-admin@gmail.com
 *         password: salom
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /avtosalon/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Users]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/userLoginSchema'
 *     responses:
 *       201:
 *         description: Login.
 *         content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/userRegistrationSchema'
 *       404:
 *          description: User not found
 *       400:
 *          description: Bad request
 *       500:
 *          description: Internal server error
 *
 */

//UPDATE USER:

/**
 * @swagger
 * components:
 *   schemas:
 *     userUpdateSchema:
 *       type: object
 *       properties:
 *         userEmail:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           description: User's password
 *         password2:
 *           type: string
 *           description: User's password repeating
 *         id:
 *           type: string
 *           description: User's id (if required)
 *         userRole:
 *           type: string
 *           description: User's role (if required)
 *         profileImg:
 *           type: String
 *           format: binary
 *
 *       example:
 *         userEmail: begzod@gmail.com
 *         password: 123$abc
 *         password2: 123$abc
 *         profileImg: File
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /avtosalon/update-user-by-admin:
 *   put:
 *     summary: Update user by admin and self-update
 *     tags: [Users]
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
 *                userEmail:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *                password2:
 *                  type: string
 *                id:
 *                  type: string
 *                userRole:
 *                  type: string
 *                  default: user
 *                profileImg:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: Updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userUpdateSchema'
 *       400:
 *          description: User already exists
 *       500:
 *         description: Internal server error
 *
 */

//DELETE-USER

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /avtosalon/delete-user-by-admin:
 *   delete:
 *     summary: Delete user by admin and self-delete
 *     tags: [Users]
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
 *         description: User was deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userUpdateSchema'
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 */

//BUY CAR

/**
 * @swagger
 * components:
 *   schemas:
 *     userCarSchema:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *           id:
 *           type: string
 *           description: Car's id
 *       example:
 *         id: car1
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /avtosalon/buy-car:
 *   post:
 *     summary: Place car into the cart
 *     tags: [Users]
 *     parameters:
 *     - in: header
 *       name: token
 *       schema:
 *         type: string
 *         required: true
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/userCarSchema'
 *     responses:
 *       201:
 *         description: Buying process of the car.
 *         content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/userCarSchema'
 *       404:
 *          description: Car not found
 *       400:
 *          description: Bad request
 *       500:
 *          description: Internal server error
 *
 */

//LIKE-CAR

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /avtosalon/like-car:
 *   post:
 *     summary: Like the car by user
 *     tags: [Users]
 *     parameters:
 *     - in: header
 *       name: token
 *       schema:
 *         type: string
 *         required: true
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/userCarSchema'
 *     responses:
 *       201:
 *         description: Liking the car.
 *         content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/userCarSchema'
 *       404:
 *          description: Car not found
 *       400:
 *          description: Bad request
 *       500:
 *          description: Internal server error
 *
 */
