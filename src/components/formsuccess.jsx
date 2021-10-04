import styled from "styled-components";

const SFormError = styled.span`
  color: rgb(54, 205, 149);
  font-weight: 600;
  font-size: 12px;
  margin: 5px 0px 10px 0px;
  visibility: ${(props) => (props.hidden ? "hidden" : "visible")};
`;

function FormSuccess({ message, hidden }) {
  return message === "" || !message ? null : (
    <SFormError hidden={hidden}>{message}</SFormError>
  );
}

export default FormSuccess;
