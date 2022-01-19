import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "user_id = :id",
      ExpressionAttributeValues: {
        ":id": userid,
      },
    })
    .promise();

  const todos = response.Items;

  if (todos.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "User not found!",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todos),
  };
};
