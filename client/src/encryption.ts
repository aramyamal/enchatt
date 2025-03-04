// helper function to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

// function to hash a string using SHA-256
export async function hashKey(input: string): Promise<string> {
    if (input.trim() === "") {
        return "";
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
}
