import React from "react";

const Debug = value => <pre>{JSON.stringify(value, null, 2)}</pre>;

export default Debug;