export type EstimateFormPayload = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  service?: string;
  message?: string;
  commercialProperty?: boolean;
  smsConsent?: boolean;
};

export async function submitEstimateForm(payload: EstimateFormPayload) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: "New estimate request from the Gary's Pipelining website",
      from_name: payload.name,
      ...payload,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong submitting the form.");
  }
  return data;
}
