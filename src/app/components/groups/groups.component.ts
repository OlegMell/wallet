import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';

import { Group } from '../../core/interfaces/group.interface';
import { GroupsService } from '../../core/features/groups/groups.service';
import { BudgetsRepository } from '../../store/repositories/budgets-repository.service';

@Component({
  standalone: true,
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent implements OnInit {

  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  addGroupForm!: FormGroup;

  public readonly groupsService: GroupsService = inject(GroupsService);
  public readonly budgetsService: BudgetsRepository = inject(BudgetsRepository);

  ngOnInit(): void {
    this.addGroupForm = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [ Validators.required ] }),
      users: new FormControl('', { nonNullable: true, }),
    });
  }

  showAddGroupDialog(): void {
    this.dialog()?.nativeElement.showModal();
  }

  closeDialog(): void {
    this.dialog()?.nativeElement.close();
  }

  addGroupSubmit(): void {
    this.groupsService.addGroup(this.addGroupForm.value)
      .subscribe(() => {
        this.closeDialog();
        this.groupsService.fetchData();
      });
  }

  selectGroup(group: Group): void {
    this.budgetsService.getAll(group.id!).subscribe();
  }
}
