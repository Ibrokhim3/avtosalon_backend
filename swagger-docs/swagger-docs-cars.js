//GET-ALL-MODELS

/**
 * @swagger
 * tags:
 *   name: Models
 *   description: The Models managing API
 * /avtosalon/get-models:
 *   get:
 *     summary: Lists of all Models(cars)
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: The list of the models
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad  request
 *       500:
 *         description:  Internal server error
 *
 */

//GET_ONE_MODEL

/**
 * @swagger
 * tags:
 *   name: Models
 *   description: The Models managing API
 * /avtosalon/get-models/{id}:
 *   get:
 *     summary: Get one selected car
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id of the car
 *         schema:
 *          type: string
 *          required: true
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: The list of the models
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad  request
 *       500:
 *         description:  Internal server error
 *
 */

// ADD-MODEL

/**
 * @swagger
 * components:
 *   schemas:
 *     modelAddSchema:
 *       type: object
 *       required:
 *         - carName
 *         - carPrice
 *         - tonirovka
 *         - motor
 *         - year
 *         - color
 *         - distance
 *         - gearbox
 *         - desc
 *         - carCategory
 *         - carImg
 *         - carImg1
 *         - carImg2
 *         - carImg3
 *       properties:
 *           carName:
 *             type: string
 *           carPrice:
 *             type: number
 *           tonirovka:
 *             type: string
 *           motor:
 *             type: string
 *           year:
 *             type: string
 *           color:
 *             type: string
 *           distance:
 *             type: number
 *           gearbox:
 *             type: string
 *           desc:
 *             type: string
 *           carCategory:
 *             type: string
 *           carImg:
 *             type: string
 *             format: binary
 *           carImg1:
 *             type: string
 *             format: binary
 *           carImg2:
 *             type: string
 *             format: binary
 *           carImg3:
 *             type: string
 *             format: binary
 *
 */

/**
 * @swagger
 * tags:
 *   name: Models
 *   description: The Models managing API
 * /avtosalon/add-model:
 *   post:
 *     summary: Create a new model
 *     tags: [Models]
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
 *                carName:
 *                  type: string
 *                carPrice:
 *                  type: number
 *                tonirovka:
 *                  type: string
 *                motor:
 *                  type: string
 *                year:
 *                  type: string
 *                color:
 *                  type: string
 *                distance:
 *                  type: string
 *                gearbox:
 *                  type: string
 *                desc:
 *                  type: string
 *                carCategory:
 *                  type: string
 *                carImg:
 *                  type: string
 *                  format: binary
 *                carImg1:
 *                  type: string
 *                  format: binary
 *                carImg2:
 *                  type: string
 *                  format: binary
 *                carImg3:
 *                  type: string
 *                  format: binary
 *     responses:
 *       201:
 *         description: Model added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/modelAddSchema'
 *       400:
 *          description: Bad request, fill the form correctly
 *       500:
 *         description: Internal server error
 *
 */

//UPDATE-MODEL

/**
 * @swagger
 * components:
 *   schemas:
 *     modelUpdateSchema:
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
 *   name: Models
 *   description: The Models managing API
 * /avtosalon/update-model:
 *   put:
 *     summary: Update model(car) by admin
 *     tags: [Models]
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
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                carName:
 *                  type: string
 *                carPrice:
 *                  type: number
 *                tonirovka:
 *                  type: string
 *                motor:
 *                  type: string
 *                year:
 *                  type: string
 *                color:
 *                  type: string
 *                distance:
 *                  type: string
 *                gearbox:
 *                  type: string
 *                desc:
 *                  type: string
 *                carCategory:
 *                  type: string
 *                carImg:
 *                  type: string
 *                  format: binary
 *                carImg1:
 *                  type: string
 *                  format: binary
 *                carImg2:
 *                  type: string
 *                  format: binary
 *                carImg3:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: Updated.
 *       400:
 *          description: Bad request
 *       500:
 *         description: Internal server error
 *
 */

//DELETE MODEL

/**
 * @swagger
 * tags:
 *   name: Models
 *   description: The Models managing API
 * /avtosalon/delete-model:
 *   delete:
 *     summary: Delete model by admin
 *     tags: [Models]
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
 *         description: Model was deleted.
 *       400:
 *         description: Bad request
 *       404:
 *         description: Model not found
 *       500:
 *         description: Internal server error
 *
 */
