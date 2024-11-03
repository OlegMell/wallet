import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, viewChild, viewChildren } from '@angular/core';

import { GroupsService } from '../../core/features/groups/groups.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component( {
  standalone: true,
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class GroupsComponent implements OnInit {


  dialog = viewChild<ElementRef<HTMLDialogElement>>( 'dialog' );

  private readonly cd: ChangeDetectorRef = inject( ChangeDetectorRef );
  public readonly groupsService: GroupsService = inject( GroupsService );
  addGroupForm!: FormGroup;

  ngOnInit(): void {
    this.addGroupForm = new FormGroup( {
      name: new FormControl( '', { nonNullable: true, validators: [ Validators.required ] } ),
      users: new FormControl( '', { nonNullable: true, } ),
    } );
  }

  showAddGroupDialog() {
    this.dialog()?.nativeElement.showModal();
  }

  closeDialog() {
    this.dialog()?.nativeElement.close();
  }

  addGroupSubmit() {
    console.log( this.addGroupForm.value );
  }

}
