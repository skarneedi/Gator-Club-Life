import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventPermitService {
  private permitType: string = '';
  private basicInfo: any = {};
  private slots: any[] = [];
  private documents: any[] = [];
  private notes: string = '';

  setPermitType(type: string) {
    this.permitType = type;
  }
  getPermitType() {
    return this.permitType;
  }

  setBasicInfo(info: any) {
    this.basicInfo = info;
  }
  getBasicInfo() {
    return this.basicInfo;
  }

  setSlots(slots: any[]) {
    this.slots = slots;
  }
  getSlots() {
    return this.slots;
  }

  setDocuments(docs: any[]) {
    this.documents = docs;
  }
  getDocuments() {
    return this.documents;
  }

  setAdditionalNotes(notes: string) {
    this.notes = notes;
  }
  getAdditionalNotes() {
    return this.notes;
  }

  getFinalPayload() {
    return {
      event_permit: {
        ...this.basicInfo,
        permit_type: this.permitType,
        additional_notes: this.notes
      },
      slots: this.slots,
      documents: this.documents
    };
  }

  reset() {
    this.permitType = '';
    this.basicInfo = {};
    this.slots = [];
    this.documents = [];
    this.notes = '';
  }
}