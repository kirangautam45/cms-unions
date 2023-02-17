/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";

function ZModal({ children, opened }) {
  return (
    <div className={`zmodal ${opened ? "opened" : ""}`}>
      <MDBox className="zmodal_card_holder">
        <Card>
          <MDBox className="zmodal_content" p={3}>
            {children}
          </MDBox>
        </Card>
      </MDBox>
    </div>
  );
}
export default ZModal;
