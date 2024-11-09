import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
  viewChildren
} from '@angular/core';

import { GroupsService } from '../../core/features/groups/groups.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetsRepository } from '../../store/repositories/budgets-repository.service';
import { Group } from '../../core/interfaces/group.interface';

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

  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  public readonly groupsService: GroupsService = inject(GroupsService);
  public readonly budgetsService: BudgetsRepository = inject(BudgetsRepository);


  ngOnInit(): void {
    this.addGroupForm = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [ Validators.required ] }),
      users: new FormControl('', { nonNullable: true, }),
    });
  }

  showAddGroupDialog() {
    this.dialog()?.nativeElement.showModal();
  }

  closeDialog() {
    this.dialog()?.nativeElement.close();
  }

  addGroupSubmit() {
    this.groupsService.addGroup(this.addGroupForm.value)
      .subscribe((res) => {
        this.closeDialog();
        this.groupsService.fetchData();
      });
  }

  selectGroup(group: Group): void {
    console.log(group);
    this.budgetsService.getAll(group.id!)
      .subscribe((res) => {
        console.log(res);
      })
  }
}
