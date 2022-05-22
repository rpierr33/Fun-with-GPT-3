import React, { useEffect, useState } from "react";
import { Form, Button, Card, ListGroup } from "react-bootstrap";
import  './Prompt.css';




const { Configuration, OpenAIApi } = require("openai");

// const apiKey = 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

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
});
const openAI = new OpenAIApi(configuration);

const Prompt = () => {
  const [response, setResponse] = useState(null);
  const onFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());

    const data = await openAI.createCompletion("text-curie-001", {
      prompt: "\n",
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    const text = data?.data?.choices[0]?.text;
    setResponse(text);

    const obj = {
      prompt: formDataObj.promptInput,
      response: text,
    };

    const collection = JSON.parse(localStorage.getItem("responses"));

    collection.push(obj);

    localStorage.setItem("responses", JSON.stringify(collection));
  };

  useEffect(() => {
    localStorage.setItem("responses", JSON.stringify([]));
  }, []);

  return (
    <div className="mainContainer">
      <h1>Fun With GPT-3</h1>
      <Form onSubmit={onFormSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="prompt">Enter Prompt</Form.Label>
          <Form.Control 
            className="textarea"
            type="text"
            name="promptInput"
            placeholder="Please be as descriptive as possible to get the best results"
          />
        </Form.Group>
        <Button className="button" variant="primary" size="lg" type="submit">
          Submit
        </Button>
      </Form>
      <Card>
        <Card.Body>
          {/* <Card.Title> <h1>{this.state.heading}</h1></Card.Title> */}
          {/* <Card.Text> */}
          <h4>{response}</h4>
          {/* </Card.Text> */}
        </Card.Body>
      </Card>
      <br />
      <ListGroup as="ol" numbered>
        {JSON.parse(localStorage.getItem("responses"))?.map((item) => (
          <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{item.prompt}</div>
              {item.response}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Prompt;
