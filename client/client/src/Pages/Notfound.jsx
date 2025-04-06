import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { FrownOutlined } from "@ant-design/icons";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "5rem", fontWeight: "bold", color: "#ff4d4f" }}>
        404
      </h1>
      <h2 style={{ fontSize: "2rem", color: "#595959" }}>
        Page Not Found <FrownOutlined />
      </h2>
      <p style={{ color: "#8c8c8c", fontSize: "1.2rem" }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Button
        type="primary"
        size="large"
        onClick={() => navigate("/")}
        style={{ marginTop: "20px" }}
      >
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
