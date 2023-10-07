export enum StatusOrder {
    PENDING = 'pending', // order created, waiting for confirm by admin or staff
    CONFIRMED = 'confirmed', // order confirmed by admin or staff
    SHIPPING = 'shipping', // order has been picked up by staff and is being shipped
    COMPLETED = 'completed', // order has been delivered
    CANCELLED = 'cancelled',
}

export enum PaymentMethodOrder {
    CASH = 'cash', // paid at store
    COD = 'cod', // paid at delivery (cash on delivery)
    VNPAY = 'vnpay', // paid by VNPAY
    MOMO = 'momo', // paid by Momo
    PAYPAL = 'paypal', // paid by Paypal
}

export enum TypeAction {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum ReportType {
    OBSCENE_CONTENT = 'obscene',
    HATE_SPEECH_CONTENT = 'hate speech',
    THREATENING_CONTENT = 'threatening',
    HARASSMENT_CONTENT = 'harassment',
    ABUSE_CONTENT = 'abuse',
    OTHER = 'other',
}

export enum StatusCode {
    SUCCESS = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 404,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
}
