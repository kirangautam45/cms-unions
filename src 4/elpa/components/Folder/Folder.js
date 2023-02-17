import { styled } from "@mui/material/styles";

export default styled("div")`
  & {
    width: 150px;
    height: 105px;
    margin: 0 auto;
    margin-top: 50px;
    position: relative;
    background-color: #708090;
    border-radius: 0 6px 6px 6px;
    box-shadow: 4px 4px 7px rgba(0, 0, 0, 0.59);
  }

  &:before {
    content: "";
    width: 50%;
    height: 12px;
    border-radius: 0 20px 0 0;
    background-color: #708090;
    position: absolute;
    top: -12px;
    left: 0px;
  }
`;
