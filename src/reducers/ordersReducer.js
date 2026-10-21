const initialOrders = [];

export { initialOrders };

export default function ordersReducer(state, action) {
  switch (action.type) {
    case "ADD_ORDER":
      return [action.payload, ...state];

    case "UPDATE_STATUS":
      return state.map((order) =>
        order.id === action.payload.id
          ? {
              ...order,
              status: action.payload.status,
            }
          : order
      );

    case "CLEAR_ORDERS":
      return [];

    default:
      return state;
  }
}