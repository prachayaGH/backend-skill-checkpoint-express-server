import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateQuestion } from "../middleware/question.Validation.mjs";
const questionRouter = Router();

questionRouter.post("/", validateQuestion, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    await connectionPool.query(
      `insert into questions (title, description, category)
        values ($1, $2, $3)`,
      [title, description, category]
    );
    return res.status(201).json({
      message: "created question successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
      error: error.message,
    });
  }
});

questionRouter.get("/search", async (req, res) => {
    const titleQuestion = req.query.title;
    const categoryQuestion = req.query.category;
    try {
      let query = `select * from questions`; // where title = titleQuestion
      let conditions = [];
      let values = [];
  
      if (titleQuestion) {
        conditions.push(`title = $${values.length + 1}`);
        values.push(titleQuestion);
      }
  
      if (categoryQuestion) {
        conditions.push(`category = $${values.length + 1}`);
        values.push(categoryQuestion);
      }
      if (conditions.length > 0) {
        query += " where " + conditions.join(" and ");
      }
      const result = await connectionPool.query(query, values);
      return res.status(200).json({
        data: result.rows,
      });
    } catch (error) {
      return res.status(500).json({
        message: "fail",
        error: error.message,
      });
    }
  });

questionRouter.get("/", async (req, res) => {
  try {
    let allQuestion = await connectionPool.query(`select * from questions`);
    return res.status(200).json({
      data: allQuestion.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
      error: error.message,
    });
  }
});

questionRouter.get("/:questionId", async (req, res) => {
  let questionParams = req.params.questionId;
  try {
    let questionById = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionParams]
    );

    if (questionById.rows.length === 0) {
      return res.status(400).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      data: questionById.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch questions",
    });
  }
});

questionRouter.put("/:questionId", validateQuestion, async (req, res) => {
  const updateQuestion = { ...req.body };
  let questionParams = req.params.questionId;
  try {
    await connectionPool.query(
      `update questions set
        title = $2,
        description = $3,
        category = $4
        where id = $1
        `,
      [
        questionParams,
        updateQuestion.title,
        updateQuestion.description,
        updateQuestion.category,
      ]
    );
    if (questionById.rows.length === 0) {
      return res.status(400).json({
        message: "Question not found.",
      });
    }
    return res.status(200).json({
      message: "Question updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionRouter.delete("/:questionId", async (req, res) => {
  let questionById = req.params.questionId;
  try {
    const result = await connectionPool.query(`delete from questions where id = $1`, [
      questionById,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Question not found.",
      });
    }
    return res.status(200).json({
      message: "Question post has been deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete question.",
      error: error.message,
    });
  }
});



export default questionRouter;
