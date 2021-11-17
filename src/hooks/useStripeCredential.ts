import {
  getSetupIntentClientSecret,
  setSetupIntentClientSecret,
} from 'api/stripe';
import { API_BASE } from 'config';
import useCustomerToken from 'hooks/useCustomerToken';
import { useCallback, useEffect } from 'react';
import { createStripeSetupIntent } from 'utils/api';

const useStripeCredential = (): void => {
  const { customerName, token } = useCustomerToken();

  const setupIntent = useCallback(async (): Promise<void> => {
    const result = await createStripeSetupIntent(
      {
        token,
        urlOverride: API_BASE,
        body: {
          customer_name: customerName,
        },
      },
      customerName
    );
    if (!result.ok) {
      throw new Error(`An error occurred: ${result.statusText}`);
    }
    const data = await result.json();
    if (data.client_secret == null) {
      throw new Error(
        `There was a problem authenticating. Refresh the page and try again.`
      );
    }
    // Store the secret in memory so that its never saved to react state
    // and can be externally referenced.
    const currentClientSecret = getSetupIntentClientSecret();
    if (
      currentClientSecret == null &&
      data.client_secret != null &&
      currentClientSecret !== data.client_secret
    ) {
      // Update the in-memory secret if it is meaningful and has changed.
      setSetupIntentClientSecret(data.client_secret);
    }
  }, [customerName, token]);

  useEffect(() => {
    // Kickoff a flow to create a setup intent, starting with acquiring the client
    // secret from the serverside.

    try {
      setupIntent();
    } catch (err) {
      console.error(err);
    }
  }, [setupIntent]);
};

export default useStripeCredential;
