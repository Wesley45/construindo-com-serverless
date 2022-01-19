import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid";

import { document } from "../utils/dynamodbClient";

type ICreateTodo = {
  title: string;
  deadline: string;
};

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  console.log(userid, title, deadline);

  const data = {
    id: uuid(),
    user_id: userid,
    title: title,
    done: false,
    deadline: new Date(deadline),
  };

  await document
    .put({
      TableName: "todos",
      Item: data,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created!",
      todo: data,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
