import supabase from '@/lib/supabase/serverClient';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({ status: 'pending' })
      .select()
      .single();

    if (taskError) {
      return NextResponse.json({ error: taskError.message }, { status: 500 });
    }

    const firstSubtask = {
      task_id: task.id,
      payload: { message: 'step-1' }, 
      action: 'step-1',
      status: 'pending',
      parent_id: null 
    };

    const { data: subtask, error: subtaskError } = await supabase
      .from('subtasks')
      .insert(firstSubtask)
      .select()
      .single();

    if (subtaskError) {
      return NextResponse.json({ error: subtaskError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      taskId: task.id,
      subtaskId: subtask.id
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
