/**
 * Resolves display name + logo for the driver PDF from the latest companyInfo
 * document, keyed by TruckDrivers.selectedCompany.id. Falls back to main
 * company when nothing is selected, then to stale selectedCompany fields.
 *
 * @param {object|null} companyInfoData - `companyInfo` doc `.data()` (must include `id`, `companyName`, `logoUrl`, optional `additionalCompanies`)
 * @param {object|null} truckDriverData - TruckDrivers document fields
 * @returns {{ name: string, logoUrl: string|null }}
 */
export function resolvePdfCompany(companyInfoData, truckDriverData) {
  // Fallback branding when we don't have any live companyInfo document.
  // Do not use stale `selectedCompany` from the driver doc.
  const fallbackName = "DriverApp";
  const sel = truckDriverData?.selectedCompany;

  if (!companyInfoData) {
    return {
      name: fallbackName,
      logoUrl: null,
    };
  }
  console.group("companyInfoData", companyInfoData);
  const main = {
    id: companyInfoData.id ?? null,
    name:
      (companyInfoData.companyName &&
        String(companyInfoData.companyName).trim()) ||
      "",
    logoUrl: companyInfoData.logoUrl || null,
  };

  // Handle legacy spellings used in older docs as well.
  const rawAdditionalCompanies =
    companyInfoData.additionalCompanies ||
    companyInfoData.addtionalCompanies ||
    companyInfoData.aditionalCompanies ||
    [];

  const additional = Array.isArray(rawAdditionalCompanies)
    ? rawAdditionalCompanies.map((c) => ({
        id: c.id,
        name:
          (c.companyName && String(c.companyName).trim()) ||
          (c.name && String(c.name).trim()) ||
          "",
        logoUrl: c.logoUrl || null,
      }))
    : [];

  const companies = [main, ...additional].filter((c) => c.id);

  const selectedId = sel?.id ? String(sel.id).trim() : "";
  if (selectedId) {
    const match = companies.find((c) => String(c.id).trim() === selectedId);
    if (match && match.name) {
      return {
        name: match.name,
        logoUrl: match.logoUrl || main.logoUrl || sel?.logoUrl || null,
      };
    }
  }

  // If no selected company match, always prefer live main company branding.
  if (main.name) {
    return { name: main.name, logoUrl: main.logoUrl };
  }

  return {
    name: (sel?.name && String(sel.name).trim()) || fallbackName,
    logoUrl: sel?.logoUrl || main.logoUrl || null,
  };
}
