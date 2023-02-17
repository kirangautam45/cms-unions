import { styled } from "@mui/material/styles";

export default styled("div")`
  & {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 1rem;
    background: linear-gradient(179.9deg, #edd338 0.08%, #fd6c12 140.27%);
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
    border-radius: 10px;
    width: 133px;
    height: 167px;
    padding: 1rem;

    > span {
      color: #ffffff;
    }

    > .title {
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
    }

    > .total {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
    }
  }
`;
