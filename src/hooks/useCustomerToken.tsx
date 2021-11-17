import assert from 'assert';
import React, { useContext } from 'react';

interface TokenContextType {
  customerName: string;
  token: string;
}

const NO_TOKEN = 'NO_TOKEN';
const NO_CUSTOMER = 'NO_CUSTOMER';

export const TokenContext = React.createContext<TokenContextType>({
  token: NO_TOKEN,
  customerName: NO_CUSTOMER,
});

export const useCustomerToken = (): TokenContextType => {
  const { customerName, token } = useContext(TokenContext);

  assert(
    customerName !== NO_CUSTOMER && token !== NO_TOKEN,
    'Expected non-null customerName and token. Double-check that you are wrapping your component tree with `TokenProvider`'
  );
  return { customerName, token };
};

interface TokenProviderProps extends TokenContextType {
  children?: React.ReactNode;
}

export const TokenProvider = ({
  children,
  customerName,
  token,
}: TokenProviderProps): JSX.Element => {
  return (
    <TokenContext.Provider value={{ customerName, token }}>
      {children}
    </TokenContext.Provider>
  );
};

export default useCustomerToken;
