import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { ActionButton } from "../common/ActionButton";

type AppSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchBar = styled.div`
  width: min(1240px, 100%);
  display: grid;
  grid-template-columns: 1fr 58px;
  margin-bottom: 12px;
  border: 1px solid #c7c7c7;
  background: #fff;
`;

const SearchInput = styled.input`
  width: 100%;
  border: 0;
  min-height: 28px;
  padding: 5px 9px;
  font-size: 14px;
  line-height: 1;
  color: #5c5c5c;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
  }
`;

const SearchButton = styled(ActionButton)`
  width: 100%;
  height: 100%;
  min-width: 0;
  border: 0;
  font-size: 18px;
`;

export function AppSearch({
  value,
  onChange,
  placeholder = "\u041F\u043E\u0438\u0441\u043A",
}: AppSearchProps) {
  return (
    <SearchBar>
      <SearchInput
        type="search"
        placeholder={placeholder}
        aria-label={"\u041F\u043E\u0438\u0441\u043A \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <SearchButton
        type="button"
        ariaLabel={"\u041F\u043E\u0438\u0441\u043A"}
        variant="primary"
      >
        <FontAwesomeIcon icon={faSearch} />
      </SearchButton>
    </SearchBar>
  );
}