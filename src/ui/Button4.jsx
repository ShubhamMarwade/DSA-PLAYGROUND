import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Button4 = () => {

  const navigate = useNavigate();
  return (
    <StyledWrapper>
      <button className="shadow__btn"
      onClick={() => navigate('/queue')} 
      data-search-term="queue">
        QUEUE
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  .shadow__btn {
    padding: 10px 20px;
    width: 200px;
    height: 50px;
    border: none;
    font-size: 17px;
    color: #fff;
    border-radius: 50px;
    letter-spacing: 4px;
    font-weight: 700;
    text-transform: uppercase;
    transition: 0.5s;
    transition-property: box-shadow;
    background: rgb(255, 25, 0);
    box-shadow: 0 0 25px rgba(255, 25, 0, 0.55);
    cursor: pointer;
  }

  .shadow__btn:hover {
    box-shadow: 0 0 5px rgb(255, 25, 0),
                0 0 25px rgb(255, 25, 0),
                0 0 50px rgb(255, 25, 0);
  }
`;

export default Button4;
