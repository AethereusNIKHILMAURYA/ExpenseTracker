import { api } from "lwc";
import LightningModal from "lightning/modal";

export default class expensepop extends LightningModal {
    @api expenseFields;
    errors;
    closePopupSuccess(event) {
        this.close(event.detail.id);
    }
    closePopup() {
        this.close();
    }
}
