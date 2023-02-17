import { styled } from "@mui/material/styles";

export default styled("div")`
  & {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 0.5rem;
    background: white;
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
    border-radius: 10px;
    width: 100%;
    height: auto;
    padding: 1rem;

    &:hover .actions {
      display: flex;
    }

    .actions {
      display: none;
    }
  }
`;
