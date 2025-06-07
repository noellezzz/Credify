// IDL Factory - Defines the structure of the actor's API
export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    // Function signatures that your actor exposes
    storeCertificate: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [],
      []
    ),
    revokeCertificate: IDL.Func(
      [IDL.Text], // Input parameter (certificate ID)
      [IDL.Bool], // Return type
      ["query"]
    ),
    getCertificate: IDL.Func(
      [IDL.Text], // Input parameter (certificate ID)
      [
        IDL.Opt(
          IDL.Record({
            // Return type, in this case, a Certificate object
            id: IDL.Text,
            fileHash: IDL.Text,
            contentHash: IDL.Text,
            fileType: IDL.Text,
            imageUrl: IDL.Text,
            ocrContent: IDL.Text,
            timestamp: IDL.Int,
            revoked: IDL.Bool,
          })
        ),
      ],
      ["query"]
    ),
    listCertificates: IDL.Func(
      [],
      [IDL.Vec(IDL.Text)], // Return type (array of strings, certificate IDs)
      ["query"]
    ),
  });
};
