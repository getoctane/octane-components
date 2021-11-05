import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export interface Props {
  customerToken: string;
}

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/camelcase */
interface PricePlan {
  name: string;
  display_name: string;
  description: string;
  base_price: number;
  period: string;
  metered_components: {
    meter_name: string;
    price_scheme: {
      display_name: string;
      name: string;
      scheme_type: string;
      time_unit_name: string;
      unit_name: string;
      prices: {
        price: number;
        cap: number;
      }[];
    };
  }[];
}
/* eslint-enable @typescript-eslint/naming-convention, @typescript-eslint/camelcase */

const TokenContext = React.createContext<string>('NO_TOKEN');

function PricePlanCard({ pricePlan }: { pricePlan: PricePlan }): JSX.Element {
  return <div>Plan name: {pricePlan.display_name} </div>;
}

function PricePlanManager(): JSX.Element {
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const result = await fetch('https://api.cloud.getoctane.io/price_plans/');
      if (!result.ok) {
        throw new Error('Something went wrong fetching price plans');
      }
      const data = await result.json();
      setPricePlans(data);
    };
    fetchData();
  }, [setPricePlans]);

  const token = useContext(TokenContext);
  return (
    <div>
      <div>Token: "{token}"</div>
      {pricePlans.map((plan) => (
        <PricePlanCard key={plan.name} pricePlan={plan} />
      ))}
    </div>
  );
}
export default function PricePlans({ customerToken }: Props): JSX.Element {
  return (
    <TokenContext.Provider value={customerToken}>
      <PricePlanManager />
    </TokenContext.Provider>
  );
}

PricePlans.propTypes = {
  customerToken: PropTypes.string,
};
