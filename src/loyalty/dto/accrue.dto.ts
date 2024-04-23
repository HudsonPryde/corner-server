export class AccrueDto {
  "merchant_id": string;
  "type": string;
  "event_id": string;
  "created_at": string;
  "data": {
    object: {
      payment: {
        amount_money: {
          amount: bigint;
          currency: string;
        };
        application_details: {
          application_id: string;
          square_product: string;
        };
        approved_money: {
          amount: number;
          currency: string;
        };
        card_details: {
          avs_status: string;
          card: {
            bin: string;
            card_brand: string;
            card_type: string;
            exp_month: number;
            exp_year: number;
            fingerprint: string;
            last_4: string;
            prepaid_type: string;
          };
          cvv_status: string;
          entry_method: string;
          statement_description: string;
          status: string;
        };
        created_at: string;
        delay_action: string;
        delay_duration: string;
        delayed_until: string;
        id: string;
        location_id: string;
        order_id: string;
        processing_fee: {
          amount_money: {
            amount: number;
            currency: string;
          };
          effective_at: string;
          type: string;
        };
        receipt_number: string;
        receipt_url: string;
        risk_evaluation: {
          created_at: string;
          risk_level: string;
        };
        source_type: string;
        status: string;
        total_money: {
          amount: number;
          currency: string;
        };
        updated_at: string;
        version: number;
      };
    };
  };
}
