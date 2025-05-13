import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const MoreButton = () => {
  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <button onClick={() => navigate("/more")}>
        <span>More</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;

  button {
    --fs: 1.25em;
    --col1: honeydew; /* White/Light Green */
    --col2: rgba(255, 0, 0, 0.6);
    --col3:rgb(255, 0, 0); /* 🔴 red-600 */
    --col4:rgb(255, 255, 255); /* 🔴 Darker red for shadow */
    --pd: 0.5em 0.65em;
    
    display: grid;
    align-content: baseline;
    appearance: none;
    border: 0;
    grid-template-columns: min-content 1fr;
    padding: var(--pd);
    font-size: var(--fs);
    color: var(--col1); /* Ensure text remains white */
    background-color: var(--col3);
    border-radius: 50px;
    width: 150px;
    height: 50px;
    
    box-shadow: inset -2px 1px 1px var(--col2),
      inset 2px 1px 1px var(--col2);
    position: relative;
    transition: all 0.75s ease-out;
    transform-origin: center;
  }

  button:hover {
    color: var(--col1); /* 🔹 Keep text white */
    text-shadow: 1px 1px var(--col2);
  }

  button:active {
    animation: offset 1s ease-in-out infinite;
    outline: 2px solid var(--col2);
    outline-offset: 0;
  }

  button::after,
  button::before {
    content: '';
    align-self: center;
    justify-self: center;
    height: 0.5em;
    margin: 0 0.5em;
    grid-column: 1;
    grid-row: 1;
    opacity: 1;
  }

  button::after {
    position: relative;
    border: 2px solid var(--col4);
    border-radius: 50%;
    transition: all 1.5s ease-out;
    height: 0.1em;
    width: 0.1em;
  }

  button::after {
    border: 2px solid var(--col3);
    transform: rotate(-120deg);
  }

  button::before {
    border-radius: 50% 0%;
    border: 4px solid var(--col4);
    box-shadow: inset 1px 1px var(--col2);
    transition: all 1s ease-out;
    transform: rotate(45deg);
    height: 0.45em;
    width: 0.45em;
  }

  button::before {
    border-radius: 50%;
    border: 4px solid var(--col1);
    transform: scale(1.25) rotate(0deg);
    animation: blink 1.5s ease-in-out infinite alternate;
  }

  button:hover > span {
    filter: contrast(150%);
  }

  @keyframes blink {
    0% {
      transform: scale(1, 1) skewX(0deg);
      opacity: 1;
    }
    5% {
      transform: scale(1.5, 0.1) skewX(10deg);
      opacity: 0.5;
    }
    10%,
    35% {
      transform: scale(1, 1) skewX(0deg);
      opacity: 1;
    }
    40% {
      transform: scale(1.5, 0.1) skewX(10deg);
      opacity: 0.25;
    }
    45%,
    100% {
      transform: scale(1, 1) skewX(0deg);
      opacity: 1;
    }
  }

  @keyframes offset {
    50% {
      outline-offset: 0.15em;
      outline-color: var(--col1);
    }
    55% {
      outline-offset: 0.1em;
      transform: translateY(1px);
    }
    80%,
    100% {
      outline-offset: 0;
    }
  }
`;

export default MoreButton;
