export type UseCSP = () => {
  nonce?: string;
};

/**
 * Provide a default hook since not everyone need config this.
 */
const useDefaultCSP: UseCSP = () => ({});

export default useDefaultCSP;
