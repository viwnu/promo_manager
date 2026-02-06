import mongoose from 'mongoose';

/**
 * Middleware function to recursively delete all parent documents referencing a child document.
 */
export const deleteParentsRecursivelyMiddleware = async (query: mongoose.Query<any, any>, next: (err?: any) => void) => {
  const childModel = query.model; // Get the child model
  const childId = query.getQuery()?._id; // Get the child ID from the query

  if (!childId) {
    return next(); // No specific document targeted, continue without deletion
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Get all models in the current Mongoose connection
    const allModels = mongoose.modelNames().map((name) => mongoose.model(name));

    // Step 2: Iterate over all models to find references to the child
    for (const model of allModels) {
      const schema = model.schema;

      // Step 3: Find all fields that reference the child model
      const referencePaths = Object.keys(schema.paths).filter(
        (path) => schema.paths[path].instance === 'ObjectID' && schema.paths[path].options.ref === childModel.modelName,
      );

      // Step 4: Delete all parent documents referencing the child
      if (referencePaths.length > 0) {
        for (const path of referencePaths) {
          console.log(`Deleting parent documents from ${model.modelName} where ${path}=${childId}`);
          await model.deleteMany({ [path]: childId }).session(session);
        }
      }
    }

    // Step 5: Commit transaction
    await session.commitTransaction();
    session.endSession();

    console.log(`Deleted all parent references before deleting ${childModel.modelName} document.`);
    next();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error during recursive delete:', error);
    next(error);
  }
};
