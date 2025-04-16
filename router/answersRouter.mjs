import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateAnswer } from "../middleware/question.Validation.mjs";

const answersRouter = Router();

answersRouter.post("/:questionId/answers", validateAnswer, async (req, res) => {
  const { content } = req.body;
  const questionId = req.params.questionId;
  try {
    await connectionPool.query(
      `insert into answers (question_id, content)
       values ($1, $2)`,
      [questionId, content]
    );
    return res.status(201).json({
      message: "Answer created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create answers.",
      error: error.message,
    });
  }
});

answersRouter.get("/:questionId/answers", validateAnswer, async (req, res) => {
  const questionId = req.params.questionId;
  try {
    await connectionPool
      .query(`select * from answers where question_id = $1`, [questionId])
      .then((result) => {
        return res.status(200).json({
          data: result.rows,
        });
      });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch answers.",
      error: error.message,
    });
  }
});

export default answersRouter;
